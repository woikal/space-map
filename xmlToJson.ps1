
[CmdletBinding()]
param(
    [String] $in = "data\SANDBOX_0_0_0_.sbs"
    )
Write-Host $in

[xml] $xml = Get-Content -Raw $in

function position {
    param([System.Xml.XmlElement] $node)
    $pos = $node.PositionAndOrientation.Position
     @{x=$pos.x; y=$pos.y; z=$pos.z}
}

function gridDetails {
    param([System.Xml.XmlElement] $node)
    @{
        name     = $node.DisplayName
        id       = $node.EntityId
        type     = $node.GridSizeEnum
        static   = $node.IsStatic
        size     = $node.CubeBlocks.MyObjectBuilder_CubeBlock.count
        position = $(position($node))
    }
}
function planetDetails {
    param([System.Xml.XmlElement] $node)
    @{
        name     = $node.name
        id       = $node.EntityId
        type     = If ($node.radius > 20000) {"planet"} Else {"moon"} 
        position = $(position($node))
        radius   = $node.radius
    }
}

function asteroidDetails {
    param([System.Xml.XmlElement] $node)
    @{
        id       = $node.EntityId
        position = $(position($node))
    }
}

$struct = @{meta = @(); planets= @(); asteroids = @(); grids = @()}

# interate throught entities
foreach ($entity in  $xml.MyObjectBuilder_Sector.SectorObjects.MyObjectBuilder_EntityBase) {
    switch ($entity.type){
        "MyObjectBuilder_Planet"   { $struct.planets   += $(planetDetails($entity)) }
#        "MyObjectBuilder_VoxelMap" { $struct.asteroids += $(asteroidDetails($entity)) }
        "MyObjectBuilder_CubeGrid" { $struct.grids     += $(gridDetails($entity)) }
    }
}

$struct | ConvertTo-Json -Depth 4

